/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 06/11/2026 (chantier 7 articles par semaine) : article en double fusionné dans
  // son jumeau, Google le classait déjà « en double » (0 clic).
  async redirects() {
    return [
      {
        source: '/conseils/frequence-curage-maison-ancienne-centre-ville-metz',
        destination: '/conseils/curage-preventif-canalisation-frequence',
        permanent: true,
      },
    ]
  },
}
module.exports = nextConfig
