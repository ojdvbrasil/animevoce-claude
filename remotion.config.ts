import {Config} from '@remotion/cli/config';

// Quadros em JPEG de boa qualidade: o render fica bem mais rápido que em PNG
// e a diferença não aparece no vídeo final.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
