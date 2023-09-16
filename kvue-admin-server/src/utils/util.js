
function came2line(name) {
  return name.replace(/_([a-z])/g, function(match, group) {
    return group.toUpperCase();
  });
}

function line2came(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}


module.exports = { came2line, line2came }