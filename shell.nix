{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShellNoCC {
  packages = with pkgs; [
    k6
    (python3.withPackages (python-pkgs: [
      python-pkgs.pandas
      python-pkgs.seaborn
      python-pkgs.ipython
    ]))
  ];

  shellHook = ''
    code .
  '';
}
