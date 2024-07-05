package it.skillflow.DTO;

import lombok.Data;

@Data
public class ReviewDTO {

    private int id;
    private int reviewed;
    private int reviewer;
    private String reviewText;
    private int rating;

}
