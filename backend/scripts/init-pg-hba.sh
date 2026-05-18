#!/bin/bash
# Init script för att konfigurera pg_hba.conf

# Vänta tills pg_hba.conf finns
while [ ! -f /var/lib/postgresql/data/pg_hba.conf ]; do
  sleep 1
done

# Vänta lite till för att säkerställa att filen är klar
sleep 2

# Ta bort alla 'host all all' rader
sed -i '/^host.*all.*all.*all/d' /var/lib/postgresql/data/pg_hba.conf
sed -i '/^host.*all.*all.*0\.0\.0\.0/d' /var/lib/postgresql/data/pg_hba.conf
sed -i '/^host.*all.*all.*::/d' /var/lib/postgresql/data/pg_hba.conf

# Lägg till md5 för externa anslutningar
echo '' >> /var/lib/postgresql/data/pg_hba.conf
echo '# External connections' >> /var/lib/postgresql/data/pg_hba.conf
echo 'host all all 0.0.0.0/0 md5' >> /var/lib/postgresql/data/pg_hba.conf
echo 'host all all ::/0 md5' >> /var/lib/postgresql/data/pg_hba.conf

# Ladda om konfigurationen
psql -U postgres -c "SELECT pg_reload_conf();" > /dev/null 2>&1

echo "pg_hba.conf configured"
