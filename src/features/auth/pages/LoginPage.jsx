import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "@/components/common/Input";
import AuthFormWrapper from "../components/AuthFormWrapper";
import { loginSchema } from "../validation/authSchema";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fields = (
    <>
      <Input
        type="email"
        placeholder="Email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        type="password"
        placeholder="Password"
        error={errors.password?.message}
        {...register("password")}
      />
    </>
  );

  return (
    <AuthFormWrapper
      title="Login"
      fields={fields}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitLabel="Login"
    />
  );
}

export default LoginPage;
