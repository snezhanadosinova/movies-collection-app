import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "@/components/common/Input";
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
        <h1 className="text-3xl font-bold">Login</h1>

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
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
