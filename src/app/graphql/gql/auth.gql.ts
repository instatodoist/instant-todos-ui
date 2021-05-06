import {gql} from 'apollo-angular';


export const PROFILE_QUERY = gql`
  query profile{
    profile {
      email
      id
      firstname
      lastname
      profilePic {
        url
      }
    }
  }
`;

export const PROFILE_UPDATE_GQL = gql`
  mutation updateProfile($file: Upload, $input: ProfileInputType) {
    updateProfile(input: $input, image: $file){
      lastname
      firstname
    }
  }
`;

export const REGISTER_MUTATION = gql`
    mutation register( $input: UserRegisterInputType!) {
      register(input: $input){
        message
        hashToken
    }
  }
`;


export const EMAIL_VERIFICATION = gql`
    mutation emailVerificationByOtp( $input: EmailVerificationInputType!) {
      emailVerificationByOtp(input: $input){
        message
        hashToken
    }
  }
`;

export const FORGOT_PASSWORD = gql`
    mutation userForgotpassword( $input: UserForgotPasswordInputType!) {
      userForgotpassword(input: $input){
        message
        hashToken
    }
  }
`;

export const RESET_PASSWORD = gql`
    mutation userResetPassword( $input: ResetPasswordInputType!) {
      userResetPassword(input: $input){
        message
        ok
    }
  }
`;

export const UPDATE_PASSWORD_GQL = gql`
    mutation updatePassword( $input: PasswordInputType!) {
      updatePassword(input: $input){
        message
        ok
    }
  }
`;

export const LOGIN_QUERY = gql`
    query login( $input: UserLoginInputType!) {
      login(input: $input){
        token
        user {
          email
        }
    }
  }
`;


export const GOOGLE_MUTATION = gql`
    mutation googleLogin( $input: GoogleInputType!) {
      googleLogin(input: $input){
        token
        user {
          email
        }
    }
  }
`;

export default {
  REGISTER_MUTATION,
  LOGIN_QUERY
};
