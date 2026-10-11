import { AbsoluteFill } from "remotion";

import { SfxGain } from "../../components/audio/SfxCue";
import { EndCard, GridSweep, Scene, SocialBar, StageFrame, TopicTag } from "../../components/faceless/kit";
import { MemeLayer, MemePause } from "../../components/faceless/Meme";
import { FL, SFX_GAIN } from "../../components/faceless/theme";
import { cue, lineEnd } from "../../components/faceless/voice";
import { VoiceTrack } from "../../components/faceless/VoiceTrack";
import { MasterMemeSounds, masterMemes } from "./memes";
import {
  SceneBigPicture,
  SceneCar,
  SceneDiagram,
  SceneEnd,
  SceneHook,
  SceneKernel,
  SceneMistake,
  SceneRecap,
  SceneScenario,
  SceneShell,
} from "./scenes";
import { MASTER_TIMELINE as tl } from "./timeline";

/** Phase 02 master, 16:9 (pipeline/phase-02-kernel-vs-shell.md). */
export const Phase02Master: React.FC = () => {
  const endCardAt = lineEnd(tl, "10.6") + 6;
  const memes = masterMemes(tl);
  return (
    <AbsoluteFill style={{ backgroundColor: FL.bg }}>
      <VoiceTrack timeline={tl} />

      {/* the whole picture pauses and blurs while a meme plays */}
      <SfxGain value={SFX_GAIN}>
        <MasterMemeSounds tl={tl} />
        <MemePause memes={memes}>
          <StageFrame />
          {/* the grid lights up on every new beat */}
          <GridSweep at={["2.1", "3.1", "4.1", "5.1", "6.1", "7.1", "8.1", "9.1", "10.1"].map((id) => cue(tl, id))} inset={28} />
          <SceneHook tl={tl} />
          <SceneBigPicture tl={tl} />
          <SceneKernel tl={tl} />
          <SceneShell tl={tl} />
          <SceneScenario tl={tl} />
          <SceneDiagram tl={tl} />
          <SceneCar tl={tl} />
          <SceneMistake tl={tl} />
          <SceneRecap tl={tl} />
          <SceneEnd tl={tl} />

          <TopicTag text="Class 10 | Ch 1 | 1.2 Kernel vs Shell" />
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
