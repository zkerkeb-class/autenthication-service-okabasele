const OpenIDConnectStrategy = require("passport-openidconnect")
const passport = require("passport")
const User = require("../../../models/user.model")
const { createUser } = require("../../user.service")

module.exports = passport.use(
  process.env.GOOGLE_STRATEGY_NAME,
  new OpenIDConnectStrategy(
    {
      issuer: process.env.GOOGLE_ISSUER,
      authorizationURL: process.env.GOOGLE_AUTHORIZATION_URL,
      tokenURL: process.env.GOOGLE_TOKEN_URL,
      userInfoURL: process.env.GOOGLE_USERINFO_URL,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: process.env.GOOGLE_SCOPE
    },
    async function verifyCallback(issuer, profile, cb) {
      let userToReturn = null
      try {
        // Find user with matching Google ID
        const existingUser = await User.findOne({
          oauthProvider: issuer,
          oauthId: profile.id
        })
        if (!existingUser) {
          // User doesn't exist yet, create a new user
          const newUserData = {
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            username: profile.displayName,
            email: profile.emails[0].value,
            oauthProvider: process.env.GOOGLE_STRATEGY_NAME,
            oauthId: profile.id
          }
          // Save the new user to the database
          const newUser = await createUser(newUserData)
          userToReturn = newUser
        } else {
          userToReturn = existingUser
        }

        // Return the user
        return cb(null, userToReturn)
      } catch (error) {
        return cb(error, null)
      }
    }
  )
)
