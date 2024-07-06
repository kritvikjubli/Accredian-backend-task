import express, { text } from "express"
import http from "http"
import {PrismaClient} from "@prisma/client"
import {course} from "./coursedata.js"
import cors from "cors"
import nodeMailer from 'nodemailer'

const prisma = new PrismaClient()

const app = express();
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on "http://localhost:${PORT}"`);
});

const html=`
<h1>herllo/<h1>
`;

async function main(e1){
  const auth=nodeMailer.createTransport({
    service:"gmail",
    secuire:true,
    port: 465,
    auth:{
      user: "hsharrykj@gmail.com",
      pass: "shbrnzvywdovazgf"
    }
  });
  
  
  const info = await auth.sendMail({
    from : "hsharrykj@gmail.com",
    to: e1,
    subject: "Referal Sucessfull",
    text: "this is to certify that your referal was sucessfull.gi"
  })
  console.log("sucess");
}
  
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?(\d{1,3})?[-. (]?(\d{1,4})[-. )]?(\d{1,4})[-. ]?(\d{1,9})$/;


app.post('/', async (req, res) => {
  const { referral_name, referal_email, referal_phone, referee_name, refree_email, id } = req.body;
  // console.log(referee_name, " ", refree_email, " ", referal_phone, " ", referee_name, " ", refree_email, " ", id, "\n");

  try {
    const id1=parseInt(id);
    if (!referral_name || !referal_email || !referal_phone || !referee_name || !refree_email || id1<0) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!emailRegex.test(referal_email)) {
      return res.status(400).json({ error: 'Invalid referal email format' });
    }
    if(!emailRegex.test(refree_email)){
      return res.status(400).json({ error: 'Invalid refree email format' });

    }
    if (!phoneRegex.test(referal_phone)) {
      return res.status(400).json({ error: 'Invalid referal phone number format' });
    }
    

    const already_phone = await prisma.referral.findFirst({
      where: {
        referal_phone: referal_phone
      }
    });

    if (already_phone) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    const already_email = await prisma.referral.findFirst({
      where: {
        referal_email: referal_email
      }
    });

    if (already_email) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const referral = await prisma.referral.create({
      data: {
        course_id: id1,
        course_name: course[id1].name,
        referal_email,
        referal_phone,
        referral_name,
        referal_money: course[id1].referal_bonus,
        referee_name,
        refree_email,
        refree_money: course[id1].referee_bonus
      },
    });
    console.log(referral);

    main(referal_email)
    .catch(e=>console.log(e));

    res.status(201).json(referral);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
});

