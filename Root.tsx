import { Composition } from "remotion";
import { TrustDepoHome } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TrustDepoHome"
      component={TrustDepoHome}
      durationInFrames={855}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
