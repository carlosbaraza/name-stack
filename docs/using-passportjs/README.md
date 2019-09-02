# Why Auth as a service?

I chose to use an Authentication as a Service provider. Concretely, I chose Firebase
for the following reasons:

- Free (for now at least)
- Sends messages to verify email and reset password
- Centralized and I could use it easily in other services
- JWT, refresh token and sessions integrated
- Allows custom claims in the JWT (e.g adding role to user)

# Using PassportJS and custom User model

This folder includes some of the implementation for PassportJS and a custom User model.
You might need to adapt this code to make it work, but it should serve as a good reference
point on implementing such thing in NextJS.
