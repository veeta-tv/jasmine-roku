Function Main(args As Dynamic) As void

    facade = CreateObject("roImageCanvas")
    facade.Show()

    if type(args) = "roAssociativeArray" then
      for each arg in args
        print "ARGS: " + arg
      end for

      if args.url <> invalid then
        fetchLoop(args.url)
      end if
    end if

    facade.Close()
End Function

Function fetchLoop(testUrl As String)
  url = CreateObject("roUrlTransfer")
  url.SetUrl(testUrl)
  while true
    response = url.GetToString()
    if response = "" then
      print "ERROR: no response. Request failed"
    else
      print "RESP: " + response
    end if
    Sleep(1000) ' just so it doesn't go wild
  end while
End Function

