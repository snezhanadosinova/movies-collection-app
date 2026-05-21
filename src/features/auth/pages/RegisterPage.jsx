import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "@/components/common/Input";
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

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          flex
          w-full
          max-w-md
          flex-col
          gap-5
          rounded-xl
          bg-zinc-900
          p-8
        "
      >
        <h1 className="text-3xl font-bold">Register</h1>
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

        <button
          disabled={isSubmitting}
          className="
            rounded-md
            bg-red-500
            p-3
            font-semibold
            transition
            hover:bg-red-600
            disabled:opacity-50
          "
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
