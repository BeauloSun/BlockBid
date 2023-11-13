import styles from "../style";
import { discount, robot } from "../assets";
import StartExplore from "./StartExplore";

const Hero = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col justify-center items-center ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} justify-center flex-col xl:px-0 sm:px-16 px-6`}
        style={{
          backgroundImage: `url(${robot})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[52px] text-[45px] text-white ss:leading-[100.8px] leading-[75px]">
            NFTs, Music, Arts, and so much more...{" "}
            <br className="sm:block hidden" /> Security and Privacy.
          </h1>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full">
          <span className="text-gradient">All in one place</span>{" "}
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Token fractionalization, auction, and owning shares for NFTs,
          tokenized assets. We have made it possible. Embrace the security of
          Blockchain,and the flexibility offered by crypto. Making your asset
          unique.
        </p>
        {/* <div className={` ${styles.flexCenter}`}>
          <GetStarted />
        </div> */}
        <StartExplore styles={`mt-10`} />
        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>
    </section>
  );
};

export default Hero;
