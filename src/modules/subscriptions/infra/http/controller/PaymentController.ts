import pagarme from 'pagarme'
import { Request, Response } from 'express';

export default class PaymentController {
  public async store(request: Request, response: Response): Promise<Response> {
    const client = await pagarme.client.connect({
      api_key: process.env.PAGARME_API_KEY,
    });

    try {
      const transaction = await client.transactions.create(request.body);
      return response.status(201).json({ message: 'Payment successful', data: transaction });
    }
    catch(e: any){
      return response.status(500).json(e.response.errors);
    }
    
  }
}
