import { AuthPage } from "@refinedev/mui";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        defaultValues: {
          email: "admin3@kabastack.dev",
          password: "password123",
        },
      }}
    />
  );
};
