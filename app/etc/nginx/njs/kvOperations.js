import qs from "querystring";

async function GetNewToken(r) {
  //let token = await Promise.all(r.subrequest("/auth"));
  //return token;
  //await new Promise(r.subrequest("/auth") => setTimeout(resolve, 10));
  //let x = await new Promise(r.subrequest("/auth"));
  let x = new Promise.resolved(r.subrequest("/auth"));
  //let x = await r.subrequest("/auth");
  return x;
}

//async function GetExistingToken

function CheckKv(r) {
  let args = qs.parse(r.headersIn['X-Original-URI'].split('?')[1]);

  let fname = args.arg1;
  let lname = args.arg2;
  //let token = "asdf1234";
  //let token = GetNewToken(r).then(alert);
  //let token = r.subrequest('/auth');
  let token = r.variables.tokens;
  

 

/*
  if (!r.variables.tokens) {
    r.return (200, "zone not there\n");
  } else {
    r.return (200, "yay, zone exists\n");
  }
*/

  r.return (200, "Hi: " + lname + ", " + fname + ": " + token + "\n");
}

export default {CheckKv, GetNewToken}
