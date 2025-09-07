
package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"net/http"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	var rooms = []map[string]string{}

	// In-memory posts storage (roomId -> posts)
	posts := make(map[string][]map[string]string)

	// In-memory doubts storage (roomId -> doubts)
	doubts := make(map[string][]map[string]string)

	// Get rooms
	r.GET("/rooms", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"rooms": rooms})
	})
	
	// Create room
	r.POST("/rooms", func(c *gin.Context) {
		var room struct {
			Name       string `json:"name"`
			InviteCode string `json:"inviteCode"`
		}
		if err := c.ShouldBindJSON(&room); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		newRoom := map[string]string{"name": room.Name, "inviteCode": room.InviteCode}
		rooms = append(rooms, newRoom)
		c.JSON(http.StatusOK, gin.H{"room": newRoom})
	})

	// Join room
	r.POST("/rooms/join", func(c *gin.Context) {
		var req struct {
			InviteCode string `json:"inviteCode"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// Join room logic here (for demo, just return success)
		c.JSON(http.StatusOK, gin.H{"message": "Joined room successfully!", "inviteCode": req.InviteCode})
	})

	// Get posts for a room
	r.GET("/rooms/:roomId/posts", func(c *gin.Context) {
		roomId := c.Param("roomId")
		roomPosts := posts[roomId]
		c.JSON(http.StatusOK, gin.H{"posts": roomPosts})
	})

	// Create doubt
	r.POST("/rooms/:roomId/doubts", func(c *gin.Context) {
		roomId := c.Param("roomId")
		var doubt struct {
			Title   string `json:"title"`
			Content string `json:"content"`
		}
		if err := c.ShouldBindJSON(&doubt); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// Save doubt logic here (append to in-memory doubts)
		newDoubt := map[string]string{"title": doubt.Title, "content": doubt.Content}
		doubts[roomId] = append(doubts[roomId], newDoubt)
		c.JSON(http.StatusOK, gin.H{"roomId": roomId, "doubt": newDoubt})
	})

	// Get doubts for a room
	r.GET("/rooms/:roomId/doubts", func(c *gin.Context) {
		roomId := c.Param("roomId")
		roomDoubts := doubts[roomId]
		c.JSON(http.StatusOK, gin.H{"doubts": roomDoubts})
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	// File upload
	r.POST("/upload", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// Save file logic here
		c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "filename": file.Filename})
	})

	r.Run(":8000") // listen and serve on port 8000
}

