package com.moncafe.avisclients.dto;

import java.util.Date;

public class Alert {
    private long id;
    private String title;
    private String message;
    private String color;
    private String icon;
    private Date date;
    private boolean read;

   
    // Constructeur complet
    public Alert(long id, String title, String message, String color, String icon, Date date, boolean read) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.color = color;
        this.icon = icon;
        this.date = date;
        this.read = read;
    }

    // Getters et setters
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
