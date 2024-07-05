package it.skillflow.Exception;

public class FatturaNotFoundException extends RuntimeException{
    public FatturaNotFoundException(String message){
        super(message);
    }
}
