import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../db/db";
import redis from "../db/redis";
import { CreatePresentation } from "../zod/presentation";

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

       try {
        await redis.lpush("presentation_Task_queue", JSON.stringify({
          job_id: jobId,
          prompt: prompt,
          numberOfSlides: numberOfSlides,
          presentationStyle: presentationStyle
        }));
        
        await redis.publish("presentation_job_notifications", `new_job:${jobId}`);
        
        console.log(`Successfully queued job ${jobId} for processing and sent notification`);
      } catch (redisError) {
        console.error("Redis operation failed:", redisError);
        res.status(500).json({
          message: "Failed to queue presentation job",
          error: "Redis connection error"
        });
        return;
      }

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

      const status = await redis.get(`job_status:${jobId}`);
      
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
  
      
      const presentation = await redis.get(`presentation:${jobId}`);
      if (!presentation) {
         res.status(404).json({
          jobId,
          status: job.status,
          message: "Presentation not found or still processing"
        });
        return
      }

      const parsedPresentation = JSON.parse(presentation);
      const status = await redis.get(`job_status:${jobId}`);
      
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      console.log("Presentations fetched:", presentations); 

      res.status(200).json({
        message:"Presentations fetched successfully for the user",
        presentations,
        userId
      });
      return;
    } catch (error) {
      console.log("Internal Server Error ",error)
      res.status(500).json({
        message:"Internal Server Error",
        userId:req.id
      })
      return
    }
  }

  export const updatePresentation = async(req: Request,res: Response) => {
    try {
      const { id } = req.params;
      const { presentation } = req.body;
      const userId = req.body.userId;

      if(!presentation) {
        res.status(400).json({
          message: "No data provided"
        })
        return
      }

      if (!userId) {
       res.status(401).json({
        message: "Unauthorized"
       })
       return
      }

      const presentationExists = await prisma.presentationJob.findUnique({
        where: {
          id
        }
      });

      if(!presentationExists) {
        return res.status(404).json({
          message: "Presentation does not exists"
        })
      }

      if(presentationExists.userId !== parseInt(userId!)) {
        return res.status(403).json({
          message: "Unauthorized to update this presentation"
        })
      }

      const updatedPresentation = await prisma.presentationJob.update({
        where: { id },
        data: {
          presentationData: presentation
        }
      });

     return res.status(200).json({
        presentation: updatedPresentation
      });
    } catch (error:any) {
      console.error('Error updating presentation:', error.message);
     return res.status(500).json({ error: 'Failed to update presentation' });
    }
  }


export const deletePresentation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = Number(req.body.userId);

    if (!id) {
       res.status(400).json({
        message: "No presentation id provided"
       })
       return
    }

      if (!userId) {
       res.status(401).json({
        message: "Unauthorized"
       })
       return
      }

    const presentation = await prisma.presentationJob.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!presentation) {
      return res.status(404).json({
        message: "Presentation not found or unauthorized"
      });
    }

    await prisma.presentationJob.delete({
      where: {
        id
      }
    });

    res.status(200).json({
      message: "Presentation deleted successfully"
    });
    return
  } catch (error) {
    console.error("Delete presentation error:", error);
    res.status(500).json({
      message: "Failed to delete presentation"
    });
    return
  }
};