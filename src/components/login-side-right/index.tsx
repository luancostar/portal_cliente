export default function CoverLogin() {
  return (
    <div
      style={{
        background: `linear-gradient(to top, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.7)), url('src/assets/bgLogin.png')`,
        backgroundColor: `#FBFBFB`,
        backgroundSize: 'cover',  // Garante que a imagem ocupe toda a área
        backgroundRepeat: 'no-repeat',  // Impede a repetição da imagem
      }}
      className="w-full h-full bg-auto bg-initial p-10 flex-col gap-6 hidden md:flex"
    >
    </div>
  );
}
