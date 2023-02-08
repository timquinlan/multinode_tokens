async function CheckKv (r) {
  if (!r.variables.myvar) {
    let newtoken = await r.subrequest("/auth"); 
    var token = newtoken.responseBody;
    r.variables.myvar = token;
  }
  else if (r.variables.myvar) {
    var token = r.variables.myvar;
  }
  else {
    r.return(403);
    return;
  }
  r.return(204);
}

export default { CheckKv };
