async function CheckKv (r) {
  if (!r.variables.myvar) {
    let newtoken = await r.subrequest("/auth"); 
    var token = newtoken.requestText;
    r.variables.myvar = token;
  }
  else if (r.variables.myvar) {
    //put key validation code here
    r.return(204);
    return;
  }
  else {
    r.return(403);
    return;
  }
  r.return(204);
}

export default { CheckKv };
