
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as GitHubStrategy } from "passport-github2";
// import User from "../models/userModel.js";

// // Google Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails?.[0]?.value;
//         if (!email) {
//           return done(new Error("No email found in Google profile"), null);
//         }
//         let user = await User.findOne({ email });

//         if (!user) {
//           user = await User.create({
//             email,
//             name: profile.displayName,
//             password: ""
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// // Add these for cookie-based auth
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: process.env.GITHUB_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails?.[0]?.value;
//         if (!email) {
//           return done(new Error("No email found in GitHub profile"), null);
//         }

//         let user = await User.findOne({ email });

//         if (!user) {
//           // Create new user for GitHub OAuth (set password to empty string)
//           user = await User.create({
//             email,
//             name: profile.displayName || profile.username,
//             password: ""
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// export default passport;



import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/userModel.js";

// ----------------- Google Strategy -----------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email found in Google profile"), null);

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            password: "", // OAuth-only user
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ----------------- GitHub Strategy -----------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"], // request email explicitly
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub may return no public email, so fallback to placeholder
        const email = profile.emails?.[0]?.value || `${profile.username}@noemail.github.com`;

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName || profile.username,
            password: "", // OAuth-only user
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ----------------- Serialize / Deserialize -----------------
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
