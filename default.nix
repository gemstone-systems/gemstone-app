{ lib, buildNpmPackage }:

buildNpmPackage {
  pname = "gemstone-app";
  version = "0.0.1";

  src = ./.;

  npmDepsHash = lib.fakeHash;

  meta = {
    description = "frontend for gemstone, decentralised workspace app.";
    homepage = "https://github.com/gemstone-systems/gemstone-app";
    license = lib.licenses.mit;
    maintainers = with lib.maintainers; [ ];
    mainProgram = "example";
  };
}
