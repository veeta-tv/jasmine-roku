Function Main(args As Dynamic) As void

    facade = CreateObject("roImageCanvas")
    facade.Show()

    if type(args) = "roAssociativeArray" then
      for each arg in args
        print "ARGS: " + arg
      end for

      if args.url <> invalid then
        fetchLoop(args.url)
      else if args.metadata <> invalid then
        playMovie(args.metadata)
      end if

      
    end if

    facade.Close()
End Function

' Just request a simple HTTP URL and print the response on the debug console
Function fetchLoop(testUrl As String)
  http = CreateObject("roUrlTransfer")
  http.SetUrl(testUrl)
  while true
    response = http.GetToString()
    if response = "" then
      print "ERROR: no response. Request failed"
    else
      print "RESP: " + response
    end if
    Sleep(1000) ' just so it doesn't go wild
  end while
End Function

' Request metadata from the host, playing the first movie in the response
Function playMovie(metadataUrl As String)
  http = CreateObject("roUrlTransfer")
  http.setUrl(metadataUrl)
  response = http.GetToString()
  metadata = ParseJSON(response)
  if metadata <> invalid then
    port = CreateObject("roMessagePort")
    systemLog = CreateObject("roSystemLog")
    systemLog.setMessagePort(port)
    systemLog.enableType("http.connect")
    systemLog.enableType("http.error")
    video = CreateObject("roVideoScreen")
    video.setMessagePort(port)
    video.setContent(metadata)
    video.show()

    while true
      msg = wait(0, port)
      if type(msg) = "roVideoScreenEvent" then
        if msg.isStreamStarted() then
          print "VIDEO: START"
        else if msg.isFullResult() then
          print "VIDEO: DONE"
        else if msg.isRequestFailed() then
          print "ERROR: Video request failed " + stri(msg.GetIndex()) + " " + msg.GetMessage()
        end if
      else if type(msg) = "roSystemLogEvent" then
        event = msg.GetInfo()
        print "SYSLOG: " + event.LogType
        if event.LogType = "http.error" then
          print "ERROR: " + event.Status + " for " + event.Url
        else if event.LogType = "http.connect" then
          print "VIDEO: CONNECT " + event.Url
        end if
      end if
    end while
  else
    print "ERROR: Bad metadata response"
  endif

End Function


