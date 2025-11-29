import * as path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
  // Contoh kustomisasi webpack tanpa ubah struktur folder.
  webpack: (config, { dev, isServer }) => {
    // Alias untuk mempermudah import komponen: import Button from '@components/Button'
    const componentsPath = path.join(process.cwd(), "app/components");
    config.resolve.alias["@components"] = componentsPath;

    // Jika folder belum ada, hindari error import (biarkan alias, pengguna bisa buat nanti).

    // Ganti rule markdown memakai asset/source (Webpack 5) agar tanpa raw-loader.
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });

    return config;
  },
};

export default nextConfig;
