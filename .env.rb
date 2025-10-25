# ensure .env is ignored
printf ".env\n" >> .gitignore

# create .env with your Neon URL and codes
cat > .env <<'ENV'
DATABASE_URL="postgresql://neondb_owner:npg_uy9iQ5rRJFbe@ep-proud-brook-agrtyl60-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
INVITE_CODE="ppegc-demo"
NEXT_PUBLIC_INVITE_CODE="ppegc-demo"
# (later, if you add Auth.js)
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="replace-with-openssl-rand"
# EMAIL_SERVER="smtp://user:pass@smtp.resend.com:587"
# EMAIL_FROM="PEGCC <noreply@your-domain>"
# ORCID_CLIENT_ID=""
# ORCID_CLIENT_SECRET=""
ENV
