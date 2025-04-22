const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require("bcrypt")
const otpGenerator = require("otp-generator")
const jwt = require('jsonwebtoken');
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
// const emailTemplate = require("../mail/templates/emailVerificationTemplate");


exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword,
      otp } = req.body;

    //check all details are present or not
    // 403 forbidden
    // otp = '12345';
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);
    console.log(otp);
    if (!firstName || !lastName || !email || !password || !otp) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // Check if password and confirm password match
    // 400 Bad Request
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // 400 bad request
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }
    await Otp.deleteMany({ createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } });
    
    // Find the most recent OTP for the email
    const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);

    // const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log(response)
    console.log("response length",response.length);   
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "OTP is not present in database",
      })
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "OTP is wrong",
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

    return res.status(200).json({
      success: true,
      user,
      message: 'user registered successfully',
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}


// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await Otp.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await Otp.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}


//login 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }

    // Find user with provided email
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }

    // Generate JWT token and Compare Password
    // jwt = 1.payload(email,id) 2.secret key 3.options
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      )
      // Save token to user document in database
      user.token = token
      user.password = undefined
      // Set cookie for token and return success response
      console.log(user);
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
        //new add after deploye
        httpOnly: true,
        secure: true, // if using HTTPS
        sameSite: 'None' // required if secure is true
      })
      console.log(user);
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error(error)
    // Return 500 Internal Server Error status code with error message
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
  }
}



// Controller for Changing Password
// exports.changePassword = async (req, res) => {
//   try {
//     // Get user data from req.user
//     const userDetails = await User.findById(req.user.id)
//     console.log(userDetails);
//     // Get old password, new password, and confirm new password from req.body
//     const { oldPassword, newPassword } = req.body

//     // Validate old password
//     const isPasswordMatch = await bcrypt.compare(
//       oldPassword,
//       userDetails.password
//     )
//     if (!isPasswordMatch) {
//       // If old password does not match, return a 401 (Unauthorized) error
//       return res
//         .status(401)
//         .json({ success: false, message: "The password is incorrect" })
//     }

//     // Update password
//     const encryptedPassword = await bcrypt.hash(newPassword, 10)
//     const updatedUserDetails = await User.findByIdAndUpdate(
//       req.user.id,
//       { password: encryptedPassword },
//       { new: true }
//     )

//     // Send notification email
//     try {
//       const emailResponse = await mailSender(
//         updatedUserDetails.email,
//         "Password for your account has been updated",
//         passwordUpdated(
//           updatedUserDetails.email,
//           `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
//         )
//       )
//       console.log("Email sent successfully:", emailResponse.response)
//     } catch (error) {
//       // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
//       console.error("Error occurred while sending email:", error)
//       return res.status(500).json({
//         success: false,
//         message: "Error occurred while sending email",
//         error: error.message,
//       })
//     }

//     // Return success response
//     return res
//       .status(200)
//       .json({ success: true, message: "Password updated successfully" })
//   } catch (error) {
//     // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
//     console.error("Error occurred while updating password:", error)
//     return res.status(500).json({
//       success: false,
//       message: "Error occurred while updating password",
//       error: error.message,
//     })
//   }
// }


// verify email
exports.verifyEmail = async(req,res)=>{
  try {
      const {email} = req.body;
      console.log(email);
      const user = await User.findOne({email});
       // If user not found with provided email
      if (!user) {
        // Return 401 Unauthorized status code with error message
        return res.status(401).json({
          success: false,
          message: `email verification failed`,
        })
      }
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      const result = await Otp.findOne({ otp: otp })
      console.log("Result is Generate OTP Func")
      console.log("OTP", otp)
      console.log("Result", result)
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        })
      }
      const otpPayload = { email, otp }
      const otpBody = await Otp.create(otpPayload)
      console.log("OTP Body", otpBody)
      res.status(200).json({
        success: true,
        message: `OTP Sent Successfully`,
        otp,
      })

  } catch (error) {
      return res.status(401).json({
        success:false,
        message:'error occure while verifying email from database',
      })
  }
};



// otp verify
exports.verifyOtp = async(req,res)=>{
  try {
    const {otp,email} = req.body;
    console.log(otp);
    console.log(email);
    // await Otp.deleteMany({ createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } });
    
    // Find the most recent OTP for the email
    const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);

    // const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log(response)
    console.log("response length",response.length);   
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "OTP is not present in database",
      })
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "OTP is wrong",
      })
    }
    return res.status(200).json({
      success:true,
      message:'otp verified successfully',
    })
  } catch (error) {
      return res.status(400).json({
        success:false,
        message:error.message,
      });
  }
}

// Reset password controller
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email);
    console.log(newPassword);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist in database during reset password",
      });
    }

    // Hash new password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updatedUserDetails = await User.findByIdAndUpdate(
      user._id, // ✅ Corrected this line
      { password: encryptedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};
