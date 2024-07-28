import crypto, { createHash } from "node:crypto";
import { createHmac } from "node:crypto";
export default function Page({ params }: { params: { slug: string } }) {
  const iv = crypto.randomBytes(16);
  const plaintext = "99";
  const key = crypto.randomBytes(32);
  // console.log(key.toString("hex"));
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedText = cipher.update(plaintext, "utf-8", "hex");
  encryptedText += cipher.final("hex");

  return (
    <div>
      {/*{params.slug}*/}
      {encryptedText}
    </div>
  );
}
