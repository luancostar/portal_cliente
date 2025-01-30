import coverLogin from "../../assets/bgLogin.png";

export default function CoverLogin() {
  return (
    <div
      style={{
        background: `linear-gradient(to top, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.7)), url(${coverLogin})`,
        backgroundColor: `#FBFBFB`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
 
      }}
      className="w-full h-full bg-auto bg-initial p-10 flex-col gap-6 hidden md:flex"
    >
    </div>
  );
}
