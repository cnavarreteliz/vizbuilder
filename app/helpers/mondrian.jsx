import { Client as MondrianClient } from "mondrian-rest-client";
import { CUBE_API } from "helpers/consts";

const client = new MondrianClient(CUBE_API);

export default client;
