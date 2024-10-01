import LogInForm from "./components/LogInForm";
import PageLayer from "./PageLayer";

export default function LogIn() {
  return (
    <PageLayer>
      <div className="w-full flex justify-center items-center">
        <LogInForm />
      </div>
    </PageLayer>
  );
}
