#!/bin/bash

# Aller dans le dossier src/
cd "$(dirname "$0")/src"

# Trouver tous les fichiers style.scss
find . -type f -name "style.scss" | while read file; do
  # Calculer le chemin relatif vers colors.scss
  # Exemple : ../../../colors.scss
  relative_path=$(realpath --relative-to="$(dirname "$file")" "colors.scss")

  # Échapper les barres pour sed (Windows)
  escaped_path=$(echo "$relative_path" | sed 's/\//\\\//g')

  # Remplacer la ligne d'import
  sed -i "s|@import [\"']src\/colors.scss[\"'];|@import \"$relative_path\";|" "$file"

  echo "Corrigé : $file → $relative_path"
done
