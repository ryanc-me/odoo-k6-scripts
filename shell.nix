{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShellNoCC {
  packages = with pkgs; [
    k6
  ];

  shellHook = ''
    code .
  '';
}
