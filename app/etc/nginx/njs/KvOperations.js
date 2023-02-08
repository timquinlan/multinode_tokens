/*
 * import qs from "querystring";

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
  let token = r.variables.text;
  

 
  if (!r.variables.arg_text) {
    r.return (200, "zone not there\n");
  } else {
    r.return (200, "yay, zone exists\n");
  }
  
  r.return (200, "hi: " + lname + ", " + fname + ": " + token + "\n");
  return;

}

export default {CheckKv, GetNewToken}
*/

function CheckKv (r) {
		r.return(200, r.variables.myvar + '\n');
		return;
}

export default { CheckKv };

