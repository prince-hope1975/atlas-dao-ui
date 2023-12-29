import { Badge } from "components/examples/badge";
import { ChainDivProps } from "../examples/types";

export const ChainDiv = (props: ChainDivProps) => {
  return (
    <Badge variant="outline" className="space-x-2">
      {props.icon && <img alt="chain logo" src={props.icon} width={20} />}
      <span>Chain: {props.prettyName}</span>
    </Badge>
  );
};
