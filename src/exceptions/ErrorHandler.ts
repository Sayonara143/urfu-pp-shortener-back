import { Response } from 'express';
import { AppError, HttpCode } from './AppError';

class ErrorHandler {
    private isTrustedError(error: Error): boolean {
        if (error instanceof AppError) {
            return error.isOperational;
        }

        return false;
    }

    public handleError(error: Error | AppError, response?: Response): void {
        if (this.isTrustedError(error) && response) {
            this.handleTrustedError(error as AppError, response);
        } else {
            this.handleCriticalError(error, response);
        }
    }

    private handleTrustedError(error: AppError, response: Response): void {
        response.status(error.httpCode).json({
            success: false,
            error: {
                message: error.message,
                details: error.details,
            },
            data: null,
        });
    }

    private handleCriticalError(error: Error | AppError, response?: Response): void {
        if (response) {
            response.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: {
                    message: 'Internal server error',
                },
                data: null,
            });
        }

        console.log('Application encountered a critical error. Exiting');
        // process.exit(1);
    }
}

export const errorHandler = new ErrorHandler();
