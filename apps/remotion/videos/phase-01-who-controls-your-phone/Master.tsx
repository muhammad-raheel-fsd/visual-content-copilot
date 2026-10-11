import { AbsoluteFill } from "remotion";

import {
  EndCard,
  GridSweep,
  Scene,
  SocialBar,
  StageFrame,
  TopicTag,
} from "../../components/faceless/kit";
import { SfxGain } from "../../components/audio/SfxCue";
import { MemeLayer, MemePause } from "../../components/faceless/Meme";
import { FL, SFX_GAIN } from "../../components/faceless/theme";
import { cue, lineEnd } from "../../components/faceless/voice";
import { VoiceTrack } from "../../components/faceless/VoiceTrack";
import {
  SceneAnswer,
  SceneEnd,
  SceneHook,
  SceneMistake,
  SceneProblem,
  SceneRecap,
  SceneTap,
  SceneTraffic,
  SceneTranslator,
  SceneUsers,
} from "./scenes";
import { MasterMemeSounds, masterMemes } from "./memes";
import { MASTER_TIMELINE as tl } from "./timeline";

/** Phase 1 master, 16:9 (pipeline/phase-01-who-controls-your-phone.md). */
export const Phase01Master: React.FC = () => {
  const endCardAt = lineEnd(tl, "10.5") + 6;
  const memes = masterMemes(tl);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: FL.bg
      }}
    >
      <VoiceTrack timeline={tl} />
      <MasterMemeSounds tl={tl} />

      {/* the whole picture pauses and blurs while a meme plays */}
      <SfxGain value={SFX_GAIN}>
        <MemePause memes={memes}>
          <StageFrame />
          {/* the grid lights up on every new beat */}
          <GridSweep
            at={[
              "2.2",
              "3.1",
              "4.1",
              "5.1",
              "6.1",
              "7.1",
              "8.1",
              "9.1",
              "10.1",
            ].map((id) => cue(tl, id) - 8)}
            inset={28}
          />
          <SceneHook tl={tl} />
          <SceneProblem tl={tl} />
          <SceneAnswer tl={tl} />
          <SceneTraffic tl={tl} />
          <SceneTranslator tl={tl} />
          <SceneUsers tl={tl} />
          <SceneTap tl={tl} />
          <SceneMistake tl={tl} />
          <SceneRecap tl={tl} />
          <SceneEnd tl={tl} />

          <TopicTag text="Class 10 | Ch 1 | 1.1 Introduction to Operating System (OS)" />
          {/* the handles stay along the bottom all video long; the end card shows them big */}
          <Scene from={0} to={endCardAt}>
            <SocialBar />
          </Scene>
          <EndCard at={endCardAt} />
        </MemePause>
      </SfxGain>
      <MemeLayer memes={memes} />
    </AbsoluteFill>
  );
};
