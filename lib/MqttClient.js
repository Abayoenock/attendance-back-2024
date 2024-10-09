require("dotenv").config()
const mqtt = require("mqtt")
const logger = require("../lib/logger.js")
const NodeCache = require("node-cache")
const crypto = require("crypto")
const messageCache = new NodeCache({ stdTTL: 60 }) 

const createMqttClient = (topics, messageHandler) => {
  const mqtt_options = {
    username: process.env.MQTT_USERNAME, // Replace with your MQTT username
    password: process.env.MQTT_PASSWORD, // Replace with your MQTT password
  }
  const client = mqtt.connect(process.env.MQTT_SERVER, mqtt_options)

  // MQTT connection
  client.on("connect", () => {
    console.log("Connected to MQTT broker")
    topics.map((topic) => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${topic}`)
        } else {
          console.error(`Subscribe error: ${err}`)
          logger.error(err)
        }
      })
    })
  })

  // MQTT message handler
  client.on("message", (topic, message) => {
    const messageHash = crypto
      .createHash("sha256")
      .update(message)
      .digest("hex")
    if (!messageCache.has(messageHash)) {
      messageCache.set(messageHash, true)
      console.log(
        `Message arrived [${topic}] with hash [${messageHash}]: ${message.toString()}`
      )
      messageHandler(topic, message.toString())

      // Clear the message after processing
      client.publish(topic, "", { retain: true }, (err) => {
        if (err) {
          console.error(`Error clearing retained message: ${err}`)
        } else {
          console.log(`Cleared retained message for topic: ${topic}`)
        }
      })
    } else {
      console.log(
        `Duplicate message detected [${topic}] with hash [${messageHash}]: ${message.toString()}`
      )
    }
  })

  // Publish message to a topic
  const publishMessage = (topicP, messageP) => {
    console.log(topicP)
    console.log(messageP)
    client.publish(topicP, messageP, (err) => {
      if (err) {
        console.error(`Publish error: ${err}`)
        logger.error(err)
      } else {
        console.log(`Message published to topic: ${topicP}`)
      }
    })
  }

  // Clean up on exit
  const cleanUp = () => {
    client.end()
    process.exit()
  }

  process.on("exit", cleanUp)
  process.on("SIGINT", cleanUp)
  process.on("SIGTERM", cleanUp)

  return { client, publishMessage }
}

module.exports = createMqttClient
