{
  description = "visualization of nuclides and nuclear decay with data by https://www-nds.iaea.org/";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      pkgsFor = system: import nixpkgs { inherit system; };
      name = "nuclides-chart";
      version = "v1.0.0";
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgs = pkgsFor system;
        in
        {
          default = pkgs.buildNpmPackage {
            pname = name;
            version = version;

            src = pkgs.lib.cleanSource ./.;

            npmDepsHash = "sha256-0dfC1Jy5ejy2Ahpl6C/P+ZGIWXteNyh9+aFW90JVrDU=";

            NG_CLI_ANALYTICS = "false";

            npmBuildScript = "build";

            npmBuildFlags = [
              "--"
              "--base-href"
              "/Nuclides-Chart/"
            ];

            installPhase = ''
              mkdir -p $out/share/www
              # Note: Angular 17+ uses the /browser subfolder 
              cp -r dist/${name}/browser/* $out/share/www/

              # Add .nojekyll to ensure GitHub doesn't ignore files 
              touch $out/share/www/.nojekyll

              mkdir -p $out/bin
              cat <<EOF > $out/bin/${name}
              #!/bin/sh
              ${pkgs.python3}/bin/python3 -m http.server 8080 --directory $out/share/www
              EOF
              chmod +x $out/bin/${name}
            '';
          };
        }
      );

      apps = forAllSystems (
        system:
        let
          pkgs = pkgsFor system;
          devScript = pkgs.writeShellScriptBin "run-dev" ''
            ng serve
          '';
        in
        {
          default = {
            type = "app";
            program = "${self.packages.${system}.default}/bin/${name}";
            meta = {
              description = "visualization of nuclides and nuclear decay with data by https://www-nds.iaea.org/";
            };
          };
          dev = {
            type = "app";
            program = "${devScript}/bin/run-dev";
            meta = {
              description = "live-reloding for development";
            };
          };
        }
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = pkgsFor system;
        in
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs_20
              nodePackages.npm
              nodePackages."@angular/cli"
              pkg-config
            ];
          };
        }
      );
    };
}
