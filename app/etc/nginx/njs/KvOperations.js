async function CheckKv (r) {
  if (!r.variables.usertoken) {
    //
    //put user info validation code here
    //
    let newtoken = await r.subrequest("/auth"); 
    var token = newtoken.responseBody;
    r.variables.usertoken = token;
    r.return(204);
    return;
  }
  else if (r.variables.usertoken) {
    //
    //dummy key validation code
    //
    if (r.variables.usertoken.length < 10) {
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
