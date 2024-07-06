-- CreateTable
CREATE TABLE "Referral" (
    "id" SERIAL NOT NULL,
    "referral_name" TEXT NOT NULL,
    "referal_email" TEXT NOT NULL,
    "referal_phone" TEXT NOT NULL,
    "referal_money" INTEGER NOT NULL,
    "referee_name" TEXT NOT NULL,
    "refree_email" TEXT NOT NULL,
    "refree_money" INTEGER NOT NULL,
    "course_name" TEXT NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);
