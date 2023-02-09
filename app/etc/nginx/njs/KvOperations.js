async function CheckKv (r) {
  if (!r.variables.myvar) {
    //
    //put user info validation code here
    //
    let newtoken = await r.subrequest("/auth"); 
    var token = newtoken.responseBody;
    r.variables.myvar = token;
    r.return(204);
    return;
  }
  else if (r.variables.myvar) {
    //
    //put key validation code here
    if (r.variables.myvar.length < 10) {
      r.return(403);
      return;
    }
    r.return(204);
    return;
  }
  else {
    r.return(403);
    return;
  }
}

export default { CheckKv };
