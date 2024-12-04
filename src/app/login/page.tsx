import { GoogleLogin } from "./_components/google-login";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex h-svh flex-col justify-between bg-white md:h-screen">
      <main className="flex flex-1 flex-col">
        <div className="flex h-screen items-center justify-center bg-G100">
          <div className="md:w-[50%] flex items-center justify-center ">
            <div className="max-w-[480px] px-[20px]">
              <div className="mb-4">
                <div className="mb-8 flex w-full justify-center items-center">
                  <Image src={"/icons/logo.png"} alt="logo" width={200} height={80} />
                </div>
                <h1 className="text-black font-semibold text-[32px] mb-[16px]">
                  Entre.
                </h1>
                <p className="font-medium">
                  Não perca tempo, entre com sua conta Google.
                </p>
              </div>
              <GoogleLogin />
              <p className="text-G030 mt-[24px]">
                Criando uma conta, você concorda com todos os nossos{" "}
                <a className="underline text-primary" href="/termos">
                  termos e condições
                </a>
                .
              </p>
            </div>
          </div>
          <div className="md:w-[50%] hidden h-[100%] md:flex items-center justify-center bg-[url('/images/login.jpg')] bg-cover bg-no-repeat bg-center"></div>
        </div>
      </main>
    </div>
  );
}
