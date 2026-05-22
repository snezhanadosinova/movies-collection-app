import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "@/components/common/Input";
import AuthFormWrapper from "../components/AuthFormWrapper";
import { registerSchema } from "../validation/authSchema";
import { registerUser } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      toast.success("Account created successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fields = (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="First name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          type="text"
          placeholder="Last name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>
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
      title="Register"
      fields={fields}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitLabel="Register"
    />
  );
}

export default RegisterPage;
