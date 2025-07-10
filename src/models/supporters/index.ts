import { SupportersInput_1_0 } from "./1.0/supporters_input_1.0";
import { SupportersOutput_1_0 } from "./1.0/supporters_output_1.0";

type DistributiveOmit<T, K extends PropertyKey> = T extends any
 ? Omit<T, K>
 : never

export type SupportersInput = SupportersInput_1_0;
export type SupportersOutput = SupportersOutput_1_0;
export type SupportersConfig = DistributiveOmit<SupportersInput, "file">