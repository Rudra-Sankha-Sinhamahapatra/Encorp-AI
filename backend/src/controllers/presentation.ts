import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "redis";
import prisma from "../db/db";
import { CreatePresentation } from "../zod/presentation";
import { REDIS_URL } from "../config";

const redisClient = createClient({
  url: REDIS_URL || "redis://localhost:6379",
});

(async ()=> {
    await redisClient.connect();
})();

redisClient.on("error",(err)=> console.log("Redis Client Error:",err));

export const createPresentation = async (req:Request,res:Response) => {
    try {
      const result = CreatePresentation.safeParse(req.body);
      if(!result.success) {
        res.status(400).json({
            message:"Wrong inputs,zod validation failed"
        })
        return
      };

      const {prompt,numberOfSlides,presentationStyle,userId} = result.data;
      const jobId = uuidv4();

      const job = await prisma.presentationJob.create({
        data: {
            id: jobId,
            prompt,
            userId,
            status: "PENDING"
        }
      });

      await redisClient.lPush("presentation_Task_queue", JSON.stringify({
        job_id: jobId,
        prompt: prompt,
        numberOfSlides,
        presentationStyle
      }));

      res.status(200).json({
        message:"Presentation Generated Successfully",
        jobId,
        job,
        status:"PENDING"
      });
     
      return;

    } catch (error:any) {
        console.log("Error: ",error.message);
        res.status(500).json({
            message:"Internal Server Error"
        })
        return
    }
};


export const getPresentationStatus = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      
      const job = await prisma.presentationJob.findUnique({
        where: {
          id: jobId,
        }
      });

      if (!job) {
        res.status(404).json({
          message: "Presentation job not found"
        });
        return
      }

      const status = await redisClient.get(`job_status:${jobId}`);
      
    const statusValue = status ? status.toUpperCase() : "PENDING";

    if (statusValue === "COMPLETED" || statusValue === "FAILED" || statusValue === "PENDING") {
      if (job.status !== statusValue) {
        await prisma.presentationJob.update({
          where: {
            id: jobId,
          },
          data: {
            status: statusValue as any,
            updatedAt:new Date()
          }
        });
      }
    }    res.status(200).json({
        jobId,
        status: statusValue || "PENDING"
      });
      return
    } catch (error:any) {
       res.status(500).json({
        message: "Failed to get presentation status",
        error:error.message
      });
      return
    }
  };

  export const getExistingPresentationStatus = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      
      const job = await prisma.presentationJob.findUnique({
        where: {
          id: jobId,
        }
      });

      if (!job) {
        res.status(404).json({
          message: "Presentation job not found"
        });
        return
      }

      const status = job.status;
      
      res.status(200).json({
        jobId,
        status: status || "PENDING"
      });
      return
    } catch (error:any) {
       res.status(500).json({
        message: "Failed to get presentation status",
        error:error.message
      });
      return
    }
  };

  export const getPresentation = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;

      const job = await prisma.presentationJob.findUnique({
        where: {
          id: jobId,
        }
      });

      if (!job) {
        res.status(404).json({
          message: "Presentation job not found"
        });
        return
      }

      if (job.presentationData) {
        res.status(200).json({
          jobId,
          status:job.status,
          presentation: job.presentationData
        });
        return;
      }
  
      
      const presentation = await redisClient.get(`presentation:${jobId}`);
      if (!presentation) {
         res.status(404).json({
          jobId,
          status: job.status,
          message: "Presentation not found or still processing"
        });
        return
      }

      const parsedPresentation = JSON.parse(presentation);
      const status = await redisClient.get(`job_status:${jobId}`);
      
      const statusValue = status ? status.toUpperCase() : "PENDING";
  
      await prisma.presentationJob.update({
        where: {
          id: jobId,
        },
        data: {
          status: statusValue as any,
          presentationData: parsedPresentation,
          updatedAt: new Date()
        }
      });
      
        res.status(200).json({
        jobId,
        status: statusValue,
        presentation: parsedPresentation
      });
      return
    } catch (error:any) {
       res.status(500).json({
        message: "Failed to retrieve presentation",
        error:error.message
      });
      return
    }
  };

  export const getUserPresentations = async (req:Request,res:Response) => {
    try {
      const userId = Number(req.params.userId);

      console.log('User ID from token:', userId);
      if (!userId) {
        res.status(401).json({ message: 'User Id invalid' });
        return
      }

      const user = await prisma.user.findUnique({
        where:{
          id:userId
        }
      });

      if(!user) {
        res.status(404).json({
          message:"User not found"
        });
        return
      }

      const presentations = await prisma.presentationJob.findMany({
        where:{
          userId:userId
        }
      })

      console.log("Presentations fetched:", presentations); 

      res.status(200).json({
        message:"Presentations fetched successfully for the user",
        presentations,
        userId
      });
    } catch (error) {
      console.log("Internal Server Error ",error)
      res.status(500).json({
        message:"Internal Server Error",
        userId:req.id
      })
      return
    }
  }