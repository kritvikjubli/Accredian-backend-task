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


async function refreal_mail(e,n,c,m,e1,n1,m1){
  const auth=nodeMailer.createTransport({
    service:"gmail",
    secuire:true,
    port: 465,
    auth:{
      user: "hsharrykj@gmail.com",
      pass: "shbrnzvywdovazgf"
    }
  });
  const html=`
  <p>Hi ${n1},</p>
    
    <p>I hope this email finds you well.</p>
    
    <p>I wanted to share something exciting with you. I recently enrolled in an incredible course called <strong>${c}</strong>, and it has been an amazing experience so far. The course offers in-depth knowledge on [brief course description], and I believe it would be perfect for you given your interest in [relevant interest/field].</p>
    
    <p>The best part? There’s a special bonus for both of us if you decide to join through my referral! When you enroll using the referral link below, you’ll receive ${m1}, and I’ll also get a bonus as a thank you for referring you.</p>
    
    <p><a href="https://referal-accredian.netlify.app/">Here’s the referral link</a></p>
    
    <p>If you have any questions or need more details about the course, feel free to ask. I’d be happy to share more about my experience and why I think it’s worth your time.</p>
    
    <p>Looking forward to hearing from you and hopefully seeing you in the course!</p>
    
    <p>Best regards,</p>
    
    <p>${n}</p>
  `;
  const html1=`
  <p>Hi ${n},</p>
    
    <p>I hope this email finds you well.</p>
    <p>You have Refered a frien and got a Bonus of ${m}.</p>

    <p>Thankyou keep refering</p>
  `;
  
  
  const info = await auth.sendMail({
    from : "hsharrykj@gmail.com",
    to: e,
    subject: "Referal Sucessfull",
    text: html
  })
  const info2 = await auth.sendMail({
    from : "hsharrykj@gmail.com",
    to: e1,
    subject: "Referal Sucessfull",
    text: html1
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

    refreal_mail(referal_email,referee_name,course[id1],course[id1].referal_bonus,refree_email,referee_name,course[id1].referee_bonus)
    .catch(e=>console.log(e));

    res.status(201).json(referral);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
});

